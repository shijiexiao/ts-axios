import axios from '../../src/index'
import qs from 'qs'
import { AxiosTransformer } from '../../src/types/index';
axios.defaults.headers.common['test32'] = 232893478932748237849
// axios({
//     url: '/config/post',
//     method: 'post',
//     data: {
//             a: 1
//     },
//     headers: {
//         test: '323423'
//     }
// }).then(res => {
//     console.log(res.data);
// })


axios({
    transformRequest: [(function (data) {
        return qs.stringify(data)
    }), ...(axios.defaults.transformRequest as AxiosTransformer[])],
    transformResponse: [...(axios.defaults.transformResponse as AxiosTransformer[]), function (data) {
        if (typeof data === 'object') {
            data.b = 2
        }
        return data
    }],
    url: '/config/post',
    method: 'post',
    data: {
        a: 1
    }
}).then((res) => {
    console.log(res.data)
})


