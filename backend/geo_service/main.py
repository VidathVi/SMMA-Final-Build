from fastapi import FastAPI
from dotenv import load_dotenv
from routes.geo_routes import router

# Load environment variables from .env file
load_dotenv()

app = FastAPI(
    title="GEO Engine API", 
    description="Generative Engine Optimization service for Orean360",
    version="1.0"
)

# Register the modular routes
app.include_router(router)

@app.get("/")
def health_check():
    return {"status": "ok", "message": "GEO Engine API is running"}

if __name__ == "__main__":
    import uvicorn
    # Run the server on port 8000
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
