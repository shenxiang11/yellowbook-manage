import request from "../../lib/request";
import type {GetUserListRequest, GetUserListResponse} from "../../proto/proto/user.ts";

interface HttpResponse<T> {
    code: number,
    msg: string,
    data: T
}

export async function getUsers(params: Partial<GetUserListRequest>) {
    return request.post<HttpResponse<GetUserListResponse>>("/users/list", {
        ...params,
    });
}