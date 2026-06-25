import { useQuery } from "@tanstack/react-query"
import type { AxiosResponse } from "axios";
import api from "~/lib/api";
import type { Resume } from "~/lib/types";

const getResume = async (period: Date) => {
    const response: AxiosResponse<Resume> = await api.get("/users/resume", {
        params: {
            month: (period.getMonth() + 1),
            year: period.getFullYear()
        }
    });

    return response.data;
}

const resumeQuery = (period: Date) => useQuery({ queryKey: ['resume', period], queryFn: () => getResume(period!), enabled: !!period });

export default resumeQuery;