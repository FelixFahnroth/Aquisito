# Nur die Standardbibliothek — es gibt nichts zu installieren, deshalb kein
# requirements.txt und kein pip im Build.
FROM python:3.12-alpine

WORKDIR /app
COPY anmeldung.py /app/anmeldung.py

# Nicht als root laufen.
RUN adduser -D -H app
USER app

ENV PORT=8080
EXPOSE 8080

HEALTHCHECK --interval=30s --timeout=5s --start-period=5s --retries=3 \
  CMD python -c "import urllib.request,sys; sys.exit(0 if urllib.request.urlopen('http://127.0.0.1:8080/healthz', timeout=3).status==200 else 1)"

CMD ["python", "-u", "/app/anmeldung.py"]
