import type {ProColumns} from '@ant-design/pro-components';
import { ProTable} from '@ant-design/pro-components';
import useUrlState from "@ahooksjs/use-url-state";
import type {GetUserListRequest, User} from "../../proto/proto/user.ts";
import {getUsers} from "../../api/users";
import {useMemo} from "react";
import dayjs from "dayjs";
import time from "../../lib/time.tsx";

const emptyQuery = {
    birthday: undefined,
    createTimeEnd: undefined,
    createTimeStart: undefined,
    email: undefined,
    id: undefined,
    introduction: undefined,
    nickname: undefined,
    phone: undefined,
    updateTimeEnd: undefined,
    updateTimeStart: undefined,
    page: 1,
}

export default function UserList() {
    const [query, setQuery] = useUrlState<Partial<GetUserListRequest>>({});

    const columns: ProColumns<User>[] = useMemo(() => {
        return [
            {
                title: '排序',
                dataIndex: 'index',
                valueType: 'indexBorder',
                width: 48,
            },
            {
                title: 'ID',
                dataIndex: 'id',
                initialValue: query.id,
            },
            {
                title: '昵称',
                dataIndex: 'nickname',
                initialValue: query.nickname,
            },
            {
                title: '邮箱',
                dataIndex: 'email',
                width: 180,
                ellipsis: true,
                initialValue: query.email,
            },
            {
                title: '手机号',
                dataIndex: 'phone',
                width: 180,
                initialValue: query.phone,
            },
            {
                title: '生日',
                dataIndex: 'birthday',
                valueType: 'date',
                initialValue: query.birthday,
            },
            {
                title: '自我介绍',
                dataIndex: 'introduction',
                initialValue: query.introduction,
            },
            {
                title: '创建时间',
                dataIndex: 'create_time',
                hideInSearch: true,
            },
            {
                title: '创建时间',
                hideInTable: true,
                valueType: 'dateRange',
                initialValue: [query.createTimeStart, query.createTimeEnd],
                search: {
                    transform: (value) => {
                        return {
                            createTimeStart: value[0],
                            createTimeEnd: value[1],
                        };
                    },
                },
            },
            {
                title: '更新时间',
                dataIndex: 'update_time',
                hideInSearch: true,
            },
            {
                title: '更新时间',
                hideInTable: true,
                valueType: 'dateRange',
                initialValue: [query.updateTimeStart, query.updateTimeEnd],
                search: {
                    transform: (value) => {
                        return {
                            updateTimeStart: value[0],
                            updateTimeEnd: value[1],
                        };
                    },
                },
            },
        ]
    }, [query]);

    return (
        <ProTable<User>
            columns={columns}
            request={async () => {
                const res = await getUsers({
                    page: parseInt(query.page, 10),
                    pageSize: parseInt(query.pageSize, 10),
                    id: parseInt(query.id, 10),
                    email: query.email,
                    phone: query.phone,
                    introduction: query.introduction,
                    nickname: query.nickname,
                    birthday: query.birthday ? time(query.birthday).utc(true).valueOf() : undefined,
                    createTimeEnd: query.createTimeEnd ? time(query.createTimeEnd).valueOf() : undefined,
                    createTimeStart: query.createTimeStart ? time(query.createTimeStart).valueOf() : undefined,
                    updateTimeEnd: query.updateTimeEnd ? time(query.updateTimeEnd).valueOf() : undefined,
                    updateTimeStart: query.updateTimeStart ? time(query.updateTimeStart).valueOf() : undefined,
                });
                return {
                    data: res.data.data.list,
                    total: res.data.data.total,
                    success: true,
                };
            }}
            onSubmit={(params) => {
                setQuery({
                    ...emptyQuery,
                    ...params,
                });
            }}
            onReset={() => {
                // 第一次重置时，搜索内容不会被清空，但是参数已经变了，所以数据会变，第二次点才会清空
                // 这是 bug 还是 feature？
                setQuery(emptyQuery);
            }}
            rowKey="id"
            pagination={{
                showQuickJumper: true,
                showSizeChanger: true,
                current: parseInt(query.page, 10),
                pageSize: parseInt(query.pageSize, 10),
                onChange: (page, pageSize) => {
                    setQuery({
                        ...query,
                        page: page.toString(),
                        pageSize: pageSize.toString(),
                    });
                },
                onShowSizeChange: (current, pageSize) => {
                    setQuery({
                        ...query,
                        page: current.toString(),
                        pageSize: pageSize.toString(),
                    });
                }
            }}
            search={{
                layout: 'vertical',
                defaultCollapsed: true,
            }}
            dateFormatter="string"
            toolbar={{
                title: ' ',
                settings: [],
            }}
        />
    );
}
