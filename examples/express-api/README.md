# Express API Server Example

A REST API server for PDF parsing built with Express and parseflow-core.

## Features

- 📄 Extract text from uploaded PDFs
- 📊 Get PDF metadata
- 🔍 Search keywords in PDFs
- 🚀 RESTful API design
- ✅ Error handling

## Installation

```bash
npm install
```

## Usage

### Start the server

```bash
npm start
```

Server will run on `http://localhost:3000`

### API Endpoints

#### 1. Health Check
```bash
GET /health
```

#### 2. Extract Text
```bash
POST /api/pdf/extract-text
Content-Type: multipart/form-data

# Example using curl
curl -X POST -F "pdf=@document.pdf" http://localhost:3000/api/pdf/extract-text
```

Response:
```json
{
  "success": true,
  "data": {
    "text": "Extracted text content...",
    "numPages": 10,
    "info": {
      "Title": "Document Title",
      "Author": "Author Name"
    }
  }
}
```

#### 3. Get Metadata
```bash
POST /api/pdf/metadata
Content-Type: multipart/form-data

# Example using curl
curl -X POST -F "pdf=@document.pdf" http://localhost:3000/api/pdf/metadata
```

Response:
```json
{
  "success": true,
  "data": {
    "numPages": 10,
    "info": {
      "Title": "Document Title",
      "Author": "Author Name",
      "CreationDate": "2024-01-01"
    }
  }
}
```

#### 4. Search Keywords
```bash
POST /api/pdf/search
Content-Type: multipart/form-data

# Example using curl
curl -X POST \
  -F "pdf=@document.pdf" \
  -F "keyword=important" \
  -F "maxResults=10" \
  http://localhost:3000/api/pdf/search
```

Response:
```json
{
  "success": true,
  "data": {
    "keyword": "important",
    "matches": 5,
    "results": [
      {
        "page": 1,
        "context": "...this is important information..."
      }
    ]
  }
}
```

## Testing with Postman

1. Import the API endpoints
2. Create a new POST request
3. Set body type to `form-data`
4. Add a field named `pdf` with type `File`
5. Upload your PDF file
6. Send the request

## Environment Variables

```bash
PORT=3000  # Server port (default: 3000)
```

## Error Handling

All errors return a JSON response:
```json
{
  "success": false,
  "error": "Error message"
}
```

## Production Considerations

- Add authentication/authorization
- Implement rate limiting
- Add file size limits
- Use a proper file storage service
- Add request logging
- Implement CORS if needed
- Add input validation
- Use environment variables for configuration

## License

MIT
