import type { ApiResponse, Project, Team } from "./interfaces";

/**
 * Dynamically imports the fetch implementation based on the environment.
 * @returns Promise<Function> - Returns the fetch implementation.
 */
async function getFetch() {
	if (typeof window !== "undefined" && window.fetch) {
		return window.fetch.bind(window);
	}

	if (
		typeof process !== "undefined" &&
		process.versions &&
		process.versions.node
	) {
		try {
			const nodeFetch = await import("node-fetch");
			return nodeFetch.default;
		} catch (err) {
			console.error("Failed to load node-fetch:", err);
			throw new Error("Failed to load fetch implementation");
		}
	}

	throw new Error("No fetch implementation available");
}

const fetchImplementation = getFetch();

/**
 * Client class for interacting with the KURIOH. API.
 */
export class Client {
	private baseUrl: string;
	private teamId: string;
	public team: TeamResource;
	public projects: ProjectsResource;

	constructor(baseUrl: string, teamId: string) {
		this.baseUrl = baseUrl;
		this.teamId = teamId;
		this.team = new TeamResource(this);
		this.projects = new ProjectsResource(this);
	}

	get id(): string {
		return this.teamId;
	}

	/**
	 * Generic method to fetch data from the API.
	 * @param path
	 * @param responseType - The expected response type ('json' or 'blob')
	 * @returns Promise<ApiResponse<T>> - Returns the API response.
	 */
	async fetchApi<T>(
		path: string,
		responseType: "json" | "blob" = "json",
	): Promise<ApiResponse<T>> {
		let isLoading = true;
		let data: T | null = null;
		let error: Error | null = null;

		try {
			const fetch = await fetchImplementation;

			const response = await fetch(`${this.baseUrl}${path}`);
			if (!response.ok)
				throw new Error(`HTTP error! status: ${response.status}`);

			// Process response based on expected type
			if (responseType === "blob") {
				data = (await response.blob()) as unknown as T;
			} else {
				data = (await response.json()) as T;
			}
		} catch (err) {
			error = err as Error;
		} finally {
			isLoading = false;
		}

		return {
			data,
			error,
			isLoading,
			isError: error !== null,
			isSuccess: !isLoading && error === null && data !== null,
		};
	}
}

export class TeamResource {
	private client: Client;

	constructor(client: Client) {
		this.client = client;
	}

	/**
	 * Fetches the team/portfolio details.
	 * @returns Promise<ApiResponse<Team>> - Returns the team details.
	 */
	get(): Promise<ApiResponse<Team>> {
		return this.client.fetchApi<Team>(`/teams/${this.client.id}`);
	}

	/**
	 * Fetches the favicon for the team.
	 * @returns Promise<ApiResponse<Blob>> - Returns the team favicon as a Blob.
	 */
	favicon(): Promise<ApiResponse<Blob>> {
		return this.client.fetchApi<Blob>(
			`/teams/${this.client.id}/favicon`,
			"blob",
		);
	}

	/**
	 * Fetches the profile image for the team.
	 * @returns Promise<ApiResponse<Blob>> - Returns the team image as a Blob.
	 */
	image(): Promise<ApiResponse<Blob>> {
		return this.client.fetchApi<Blob>(`/teams/${this.client.id}/image`, "blob");
	}
}

export class ProjectsResource {
	private client: Client;

	constructor(client: Client) {
		this.client = client;
	}

	/**
	 * Fetches all projects for the team.
	 * @returns Promise<ApiResponse<Project[]>> - Returns all projects.
	 */
	list(): Promise<ApiResponse<Project[]>> {
		return this.client.fetchApi<Project[]>(`/teams/${this.client.id}/projects`);
	}

	/**
	 * Fetches a specific project by ID.
	 * @param projectId - The ID of the project to fetch
	 * @returns Promise<ApiResponse<Project>> - Returns the project details.
	 */
	get(projectId: string): Promise<ApiResponse<Project>> {
		return this.client.fetchApi<Project>(
			`/teams/${this.client.id}/projects/${projectId}`,
		);
	}

	/**
	 * Fetches a specific image for a project.
	 * @param projectId - The ID of the project
	 * @param imageId - The ID of the image to fetch
	 * @returns Promise<ApiResponse<Blob>> - Returns the image as a Blob.
	 */
	image(projectId: string, imageId: string): Promise<ApiResponse<Blob>> {
		return this.client.fetchApi<Blob>(
			`/teams/${this.client.id}/projects/${projectId}/images/${imageId}`,
			"blob",
		);
	}
}
