FROM python:3.9-slim

WORKDIR /code

# Copia o requirements que está na mesma pasta que este Dockerfile
COPY requirements.txt .

RUN pip install --no-cache-dir -r requirements.txt

# Copia tudo o que está em ia_service/ para dentro de /code/ no servidor
COPY . .

EXPOSE 7860

# Executa o main que está dentro da pasta app
CMD ["python", "app/main.py"]