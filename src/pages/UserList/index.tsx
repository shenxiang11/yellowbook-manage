import type { ProColumns } from '@ant-design/pro-components';
import { ProTable } from '@ant-design/pro-components';
import useUrlState from "@ahooksjs/use-url-state";
import type {User} from "../../proto/proto/user.ts";
import {getUsers} from "../../api/users";

const columns: ProColumns<User>[] = [
    {
        title: '排序',
        dataIndex: 'index',
        valueType: 'indexBorder',
        width: 48,
    },
    {
        title: 'ID',
        dataIndex: 'id',
    },
    {
        title: '昵称',
        dataIndex: 'nickname',
    },
    {
        title: '邮箱',
        dataIndex: 'email',
        width: 180,
        ellipsis: true,
    },
    {
        title: '手机号',
        dataIndex: 'phone',
        width: 180,
    },
    {
        title: '生日',
        dataIndex: 'birthday',
    },
    {
        title: '自我介绍',
        dataIndex: 'introduction',
    },
    {
        title: '创建时间',
        dataIndex: 'create_time',
        valueType: 'dateRange',
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
        valueType: 'dateRange',
        search: {
            transform: (value) => {
                return {
                    updateTimeStart: value[0],
                    updateTimeEnd: value[1],
                };
            },
        },
    },
];

export default function UserList() {

    const [query, setQuery] = useUrlState({
        page: '1', pageSize: '10',
    });

    return (
        <ProTable<User>
            columns={columns}
            request={(params) => {
                console.log(params);
                return getUsers({
                    page: query.page,
                    pageSize: query.pageSize,
                }).then(res => {
                    console.log(res);
                    return {
                        data: res.data.data.list,
                        total: res.data.data.total,
                        success: true,
                    }
                });
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
