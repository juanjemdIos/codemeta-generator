import json
import os
from fastapi import FastAPI, Query
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from somef.somef_cli import run_cli


app = FastAPI()

dict_filename = {
    "json": "metadata.json",
    "codemeta": "codemeta.json"
}
#  CORS 
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)

# @app.options("/metadata")
# async def options_metadata():
#     return JSONResponse(status_code=200)

# get metadata from somef
@app.get("/metadata")
async def get_metadata(repo_url: str = Query(..., alias="url"), threshold: float = 0.8, ignore_classifiers: bool = False):
    path = "./generated-files"
    os.makedirs(path, exist_ok=True)
    
    # json_file = os.path.join(path, "metadata.json")
    path = './generated-files/'
    try:
        run_cli(
            threshold=0.8,
            ignore_classifiers=False,
            repo_url=repo_url,
            output=path+dict_filename.get("json"),
            codemeta_out=path+dict_filename.get("codemeta")
        )
        
        # with open(path+dict_filename.get("json"), "r") as file:
        #     metadata = json.load(file)

        # return JSONResponse(content=metadata)
    
        with open(path+dict_filename.get("codemeta"), "r") as file:
            codemeta = json.load(file)

        return JSONResponse(content=codemeta)

    except Exception as e:
        return {"error": str(e)}