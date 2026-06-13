FROM python:3.11-slim

WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    && rm -rf /var/lib/apt/lists/*

# Copy requirements and install dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy the rest of the backend code
COPY . .

# Expose the FastAPI port
EXPOSE 8000

# Start the server by default. 
# To run the CLI pipeline directly instead, you can override the command:
# docker run <image> python -m main run "Build a simple calculator"
CMD ["uvicorn", "server:app", "--host", "0.0.0.0", "--port", "8000"]
