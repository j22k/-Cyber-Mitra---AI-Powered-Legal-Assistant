import os
from flask import Flask, request, jsonify
from langchain_community.vectorstores import FAISS
from langchain_community.embeddings import HuggingFaceEmbeddings
from langchain_community.llms import CTransformers # Using CTransformers for local LLM
from langchain.prompts import PromptTemplate
from langchain.chains import RetrievalQA
from typing import Dict, Any, Optional

# --- Configuration ---
FAISS_INDEX_DIR = "./faiss_index_legal" # Directory where your FAISS index is saved
# IMPORTANT: Ensure this matches the folder name created by your ingestion script!
# If your script saved to "faiss_index", change this to "./faiss_index"

EMBEDDING_MODEL_NAME = "sentence-transformers/all-MiniLM-L6-v2" # Must match ingestion script

# LLM Configuration (Using CTransformers for a local model)
# IMPORTANT: Replace with the actual path to your downloaded GGML/GGUF model file
# You can find models on Hugging Face, e.g., search for .gguf files
# Example: path/to/your/models/mistral-7b-instruct-v0.2.Q4_K_M.gguf
LLM_MODEL_PATH = "./models/mistral-7b-instruct-v0.2.Q4_K_M.gguf" # <--- *** UPDATE THIS PATH ***
LLM_MODEL_TYPE = "mistral" # e.g., "llama", "mistral", "gpt2", etc. - must match model file type

# LLM Parameters (Adjust based on your model and desired output)
LLM_CONFIG = {
    'max_new_tokens': 512, # Max tokens to generate in the response
    'temperature': 0.1,    # Creativity (lower is more focused)
    'context_length': 4096 # Max context size the model can handle
}

# --- Flask App Setup ---
app = Flask(__name__)

# --- Global Variables for RAG Components ---
# These will be initialized once when the app starts
embedding: Optional[HuggingFaceEmbeddings] = None
vectorstore: Optional[FAISS] = None
rag_chain: Optional[RetrievalQA] = None

# --- Prompt Template for the LLM ---
# Instruct the LLM to use the retrieved context
# Modify this template if you want to change the bot's persona or instructions
prompt_template = """You are a legal assistant chatbot. Use the following pieces of retrieved context to answer the question.
If you don't know the answer, just say that you don't know, don't try to make up an answer.
Keep the answer concise and relevant to the context.
Cite the source document and page number if available in the metadata for each relevant piece of information.

Context:
{context}

Question:
{question}

Answer:
"""

PROMPT = PromptTemplate(
    template=prompt_template, input_variables=["context", "question"]
)

# --- Initialization Function ---
def initialize_rag_components():
    """Loads the embedding model, vector store, and LLM."""
    global embedding, vectorstore, rag_chain

    print("Initializing RAG components...")

    # 1. Initialize Embedding Model (Must match the one used for ingestion)
    try:
        print(f"Loading embedding model: {EMBEDDING_MODEL_NAME}")
        embedding = HuggingFaceEmbeddings(model_name=EMBEDDING_MODEL_NAME)
        print("Embedding model loaded successfully.")
    except Exception as e:
        print(f"Error loading embedding model: {e}")
        return False # Initialization failed

    # 2. Load FAISS Index
    if not os.path.exists(FAISS_INDEX_DIR):
        print(f"FAISS index directory not found at {FAISS_INDEX_DIR}. Please run the ingestion script first.")
        return False # Initialization failed

    try:
        print(f"Loading FAISS index from {FAISS_INDEX_DIR}")
        # Note: allow_dangerous_deserialization=True might be necessary if used during save
        # Use with caution if the source of the index files is not trusted.
        vectorstore = FAISS.load_local(
            FAISS_INDEX_DIR,
            embedding,
            allow_dangerous_deserialization=True # Adjust based on your needs and security context
        )
        print("FAISS index loaded successfully.")
    except Exception as e:
        print(f"Error loading FAISS index: {e}")
        return False # Initialization failed

    # 3. Initialize LLM (CTransformers example for local models)
    if not os.path.exists(LLM_MODEL_PATH):
        print(f"Local LLM model file not found at {LLM_MODEL_PATH}. Please download the model file.")
        print("Ensure 'ctransformers' is installed: pip install ctransformers")
        return False # Initialization failed

    try:
        print(f"Loading local LLM model: {LLM_MODEL_PATH}")
        llm = CTransformers(
            model=LLM_MODEL_PATH,
            model_type=LLM_MODEL_TYPE,
            config=LLM_CONFIG,
            verbose=True # Set to False to reduce LLM loading output
        )
        print("LLM model loaded successfully.")
    except Exception as e:
        print(f"Error loading LLM model from {LLM_MODEL_PATH}: {e}")
        print("Ensure the model file is correct and compatible with the specified model_type.")
        return False # Initialization failed

    # 4. Create the RetrievalQA Chain
    try:
        print("Creating RetrievalQA chain.")
        retriever = vectorstore.as_retriever() # Make the vectorstore usable as a retriever

        rag_chain = RetrievalQA.from_chain_type(
            llm=llm,
            chain_type="stuff", # 'stuff' puts all retrieved context into one prompt
            retriever=retriever,
            chain_type_kwargs={"prompt": PROMPT},
            return_source_documents=True # Set to True if you want source docs in the output
        )
        print("RetrievalQA chain created successfully.")
    except Exception as e:
        print(f"Error creating RetrievalQA chain: {e}")
        return False # Initialization failed

    print("RAG components initialized successfully.")
    return True

# --- Flask Route for Chat ---
@app.route('/chat', methods=['POST'])
def chat():
    # Check if components were successfully initialized on startup
    if rag_chain is None:
        print("RAG components not initialized. Returning 500 error.")
        return jsonify({"error": "RAG components not initialized. Server might be starting or failed to load resources."}), 500

    data: Dict[str, Any] = request.json
    query: Optional[str] = data.get('query')

    if not query or not isinstance(query, str) or not query.strip():
        return jsonify({"error": "Invalid or empty 'query' provided in the request body."}), 400

    print(f"\nReceived query: '{query}'")

    try:
        # Invoke the RAG chain with the user's query
        response = rag_chain.invoke({"query": query}) # LangChain v0.2+ uses invoke

        answer = response.get('result', 'Could not generate an answer.')
        source_docs = response.get('source_documents', [])

        # Format sources for the response
        formatted_sources = []
        for doc in source_docs:
            meta = doc.metadata
            # Create a snippet of the content
            snippet_length = 200
            content_snippet = doc.page_content[:snippet_length] + ('...' if len(doc.page_content) > snippet_length else '')

            # Prepare display string for source info
            display_source = f"Source: {meta.get('source', 'N/A')}"
            if 'page' in meta:
                display_source += f", Page: {meta['page']}"
                if 'total_pages' in meta:
                     display_source += f"/{meta['total_pages']}"
            if 'topic' in meta:
                 display_source += f", Topic: {meta['topic']}"
            if 'audience' in meta:
                 display_source += f", Audience: {meta['audience']}"
            display_source += f" (Doc ID: {meta.get('doc_id', 'N/A')})" # Include generated ID

            formatted_sources.append({
                "display": display_source,
                "content_snippet": content_snippet,
                "metadata": meta # Optionally include full metadata
            })


        print("Successfully processed query.")
        return jsonify({
            "response": answer,
            "sources": formatted_sources
        })

    except Exception as e:
        print(f"An error occurred during processing query '{query}': {e}")
        import traceback
        traceback.print_exc() # Print full traceback
        return jsonify({"error": "An internal error occurred while processing your query.", "details": str(e)}), 500

# --- Entry Point ---
if __name__ == '__main__':
    # Initialize RAG components when the Flask app starts
    # This ensures embeddings, index, and LLM are loaded only once
    if initialize_rag_components():
        print("\n--- Starting Flask server ---")
        # Use debug=True for development (auto-reloads, more verbose), set to False for production
        # host='0.0.0.0' makes it accessible externally (use with caution in production)
        # port=5000 is the default Flask port
        app.run(debug=True, host='0.0.0.0', port=5000)
    else:
        print("\n--- Failed to initialize RAG components. Server will not start. ---")