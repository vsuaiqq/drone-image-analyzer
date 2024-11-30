FROM python:3.11-slim

RUN echo "deb http://ftp.debian.org/debian/ bookworm main" > /etc/apt/sources.list

RUN apt-get update && apt-get install -y --fix-missing libgl1-mesa-glx libglib2.0-0

WORKDIR /app

COPY requirements.txt .

RUN pip install --no-cache-dir -r requirements.txt

COPY . .

EXPOSE 8000

CMD ["python", "app.py"]
