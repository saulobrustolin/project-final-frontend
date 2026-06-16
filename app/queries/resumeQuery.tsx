import { useQuery } from "@tanstack/react-query"
import type { AxiosResponse } from "axios";
import { format } from "date-fns";
import type { DateRange } from "react-day-picker";
import api from "~/lib/api";
import type { Resume } from "~/lib/types";

const getResume = async (period: DateRange) => {
    const response: AxiosResponse<Resume> = await api.get("/users/resume", {
        params: {
            from: format(period.from!, 'yyyy-MM-dd'),
            to: period.to ? format(period.to, 'yyyy-MM-dd') : format(period.from!, 'yyyy-MM-dd')
        }
    });

    return response.data;
}

const resumeQuery = (period: DateRange | undefined) => useQuery({ queryKey: ['resume', period], queryFn: () => getResume(period!), enabled: !!period });

export default resumeQuery;