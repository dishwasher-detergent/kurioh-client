# Kurioh Client

A lightweight, framework-agnostic API client for interacting with the Kurioh API.

## Installation

```bash
npm install @kurioh/client
```

## Framework Agnostic

This client is designed to be completely framework-agnostic:

- No dependencies on React, Vue, Angular or any other UI framework
- Works in both browser and Node.js environments
- Automatically uses the appropriate fetch implementation
- Returns clean, typed responses that work with any codebase

## Usage

The client uses a clean, resource-based approach to API interactions.

### Basic Usage

```typescript
import { Client } from '@kurioh/client';

// Create a new client instance
const client = new Client('https://api.kurioh.com', 'your-team-id');

// Use the client to access resources
async function fetchData() {
  // Get team information
  const teamResponse = await client.team.get();
  console.log('Team name:', teamResponse.data?.name);
  
  // Get a specific project (new fluent API pattern)
  const projectResponse = await client.project('project123').get();
  console.log('Project title:', projectResponse.data?.title);
  
  // Get a project image (new fluent API pattern)
  const imageResponse = await client.project('project123').image('image456');
  if (imageResponse.isSuccess) {
    // Use the image blob as needed
    const imageBlob = imageResponse.data;
    // Example: create a URL for the image
    const imageUrl = URL.createObjectURL(imageBlob);
  }
}
```

## API Reference

### Client

```typescript
new Client(baseUrl: string, teamId: string)
```

### Team Resource

Access team-related endpoints:

```typescript
// Get team details
client.team.get(): Promise<ApiResponse<Team>>

// Get team favicon
client.team.favicon(): Promise<ApiResponse<Blob>>

// Get team profile image
client.team.image(): Promise<ApiResponse<Blob>>

// Get all team projects
client.team.projects(): Promise<ApiResponse<Project[]>>
```

### Project Resources

Access project-related endpoints:

```typescript
// Get all projects (collection method)
client.projects.getAll(): Promise<ApiResponse<Project[]>>

// Get a specific project (new fluent API)
client.project(projectId: string).get(): Promise<ApiResponse<Project>>

// Get all images for a project (new fluent API)
client.project(projectId: string).images(): Promise<ApiResponse<string[]>>

// Get a specific image from a project (new fluent API)
client.project(projectId: string).image(imageId: string): Promise<ApiResponse<Blob>>

// Legacy methods (still supported)
client.projects.get(projectId: string): Promise<ApiResponse<Project>>
client.projects.images(projectId: string): Promise<ApiResponse<string[]>>
client.projects.image(projectId: string, imageId: string): Promise<ApiResponse<Blob>>
```

### Response Format

All API calls return a standardized `ApiResponse<T>` object:

```typescript
interface ApiResponse<T> {
  data: T | null;        // The response data, or null if an error occurred
  error: Error | null;   // Error object if request failed, or null if successful
  isLoading: boolean;    // Whether the request is still in progress
  isError: boolean;      // Whether the request resulted in an error
  isSuccess: boolean;    // Whether the request was successful
}
```

## Error Handling

```typescript
const response = await client.projects.get('non-existent-id');
if (response.isError) {
  console.error('Error fetching project:', response.error.message);
} else {
  console.log('Project data:', response.data);
}
```

## License

MIT
