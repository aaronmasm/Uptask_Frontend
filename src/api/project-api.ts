import { isAxiosError } from "axios";
import api from "@/lib/axios";
import {
  editProjectSchema,
  dashboardProjectSchema,
  projectSchema,
} from "@/types/index";
import type { Project, ProjectFormData } from "@/types/index";

export async function createProject(formData: ProjectFormData) {
  try {
    const { data } = await api.post<string>("/projects", formData);
    return data;
  } catch (error) {
    if (isAxiosError(error) && error.response) {
      throw new Error(error.response.data.error);
    }
  }
}

export async function getProjects() {
  try {
    const { data } = await api<Project>("/projects");
    const response = dashboardProjectSchema.safeParse(data);
    if (response.success) {
      return response.data;
    }
  } catch (error) {
    if (isAxiosError(error) && error.response) {
      throw new Error(error.response.data.error);
    }
  }
}

export async function getProjectById(id: Project["_id"]) {
  try {
    const { data } = await api(`/projects/${id}`);
    const response = editProjectSchema.safeParse(data);
    if (response.success) {
      return response.data;
    }
  } catch (error) {
    if (isAxiosError(error) && error.response) {
      throw new Error(error.response.data.error);
    }
  }
}

export async function getFullProject(id: Project["_id"]) {
  try {
    const { data } = await api(`/projects/${id}`);
    const response = projectSchema.safeParse(data);
    if (response.success) {
      return response.data;
    }
  } catch (error) {
    if (isAxiosError(error) && error.response) {
      throw new Error(error.response.data.error);
    }
  }
}

type ProjectApiType = {
  formData: ProjectFormData;
  projectId: Project["_id"];
};

export async function updateProjectById({
  formData,
  projectId,
}: ProjectApiType) {
  try {
    const { data } = await api.put<string>(`/projects/${projectId}`, formData);
    return data;
  } catch (error) {
    if (isAxiosError(error) && error.response) {
      throw new Error(error.response.data.error);
    }
  }
}

export async function deleteProjectById(id: Project["_id"]) {
  try {
    const { data } = await api.delete<string>(`/projects/${id}`);
    return data;
  } catch (error) {
    if (isAxiosError(error) && error.response) {
      throw new Error(error.response.data.error);
    }
  }
}
