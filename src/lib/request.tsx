import axios from "axios";
import snakeCase from 'lodash-es/snakeCase'
import dayjs from "dayjs";
import timezone from "dayjs/plugin/timezone";

const instance = axios.create({
   baseURL: "http://localhost:9090",
   withCredentials: true,
});


dayjs.extend(timezone);
const userTimezone = dayjs.tz.guess();

instance.interceptors.request.use(
     (config) => {
         // 添加时区, 由于传输的是时间戳，但是像 2020-01-02 这种控件选出来的时间是当地时间的 0 点，服务端需要根据这个时区重新转成 0 时区的时间。
         config.headers['Yellow-Book-Timezone'] = userTimezone;

         if (config.data) {
             config.data = process(config.data)
         }
         return config;
     },
)

function process(params: Record<string, unknown>): Record<string, unknown> {
    const res: Record<string, unknown> = {};

    for (const [key, value] of Object.entries(params)) {
        if (value != null && typeof value === 'object') {
            res[snakeCase(key)] = process(value as Record<string, unknown>);
        } else {
            // null、NaN 直接不传输
            res[snakeCase(key)] = (value == null || Number.isNaN(value)) ? undefined : value;
        }
    }

    return res;
}

export default instance;
