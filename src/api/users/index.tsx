import request from "../../lib/request";
import type {GetUserListResponse} from "../../proto/proto/user.ts";

type GetUserRequest = {
    page: number,
    pageSize: number,
}

interface HttpResponse<T> {
    code: number,
    msg: string,
    data: T
}

export async function getUsers(params: GetUserRequest) {
    return request.get<HttpResponse<GetUserListResponse>>("/users/list", {
        params,
    });
}