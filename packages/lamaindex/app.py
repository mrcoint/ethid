from flask import Flask, request
import string
from llama_index.core import StorageContext, load_index_from_storage

# My OpenAI Key
import os
os.environ['OPENAI_API_KEY'] = "ADD YOUR CHAT GTP KEY HERE"

# rebuild storage context
storage_context = StorageContext.from_defaults(persist_dir="./index/ai_index")

# load index
index = load_index_from_storage(storage_context)
query_engine = index.as_query_engine()

app = Flask("EthID ChatBot")

nounce_vibe = "Nouns DAO has a vibe that's both innovative and community-oriented. It's like a bustling marketplace of creativity and collaboration, where people come together to tokenize and trade nouns. There's a sense of excitement and experimentation, with members actively participating in shaping the direction of the DAO and exploring the possibilities of decentralized ownership and governance. It's a space where imagination meets technology, fostering a culture of exploration and expression."
nounce_vibe_prompt = nounce_vibe + " In this vibe, answer the following question: \n\n"


@app.route("/")
def hello_world():
    return "<p>Hello, World!</p>"

@app.route("/ask")
def ask_question():
    question = request.args.get('q') 
    if(len(question) > 0):
        answer = query_engine.query(nounce_vibe_prompt + question)
        print (answer)
        print(type(str(answer)))
        return str(answer)
    return "I didn't get your question, please try asking in a different way."




