FROM python:3.12.6

WORKDIR /code

# Install dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy app
COPY main.py .
COPY knowledge_base.py .
COPY disease_detector.py .

# Create uploads dir
RUN mkdir -p uploads
RUN mkdir -p /data && chmod -R 777 /data



EXPOSE 7860

CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "7860"]
