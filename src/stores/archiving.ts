import { defineStore } from "pinia";
import { useErrorStore } from "@/stores/error.ts";
import type { ApiResponse } from "@/utils/types.ts";
import { onErrorDuringExecution } from "@/utils/error.ts";
import { DocumentService, type DocumentTypeDTO } from "@/services/archiving";

export const useArchivingStore = defineStore("archiving", {
  actions: {
    async createFile(file: File): Promise<ApiResponse<string>> {
      useErrorStore().clearGenericError();
      const { error, data } = await DocumentService.createDocument({
        body: { file: new Blob([file], { type: file.type }) },
        query: {
          size: file.size,
          name: file.name,
          type: this.getMatchingExtension(file),
          isPublic: false,
        },
      });

      if (error) {
        return onErrorDuringExecution(error);
      }

      return { data };
    },
    getMatchingExtension(file: File): DocumentTypeDTO {
      return file.type.split("/").join("_").toUpperCase() as DocumentTypeDTO;
    },
  },
});
