import axiosClient,{axiosPrivate} from "./AxiosClient";

class PostAPI {
    static async createPost(data) {
        const url = '/post';
        return axiosPrivate.post(url,data,
            {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            }
        );
    }

    static async getAllPost() {
        const url = '/post/search';
        return axiosClient.get(url);
    }

    static async searchPost(q) {
        const url = `/post/search?title=${q}&content=${q}`;
        console.log(url);
        return axiosClient.get(url);
    }

    static async getPostById(id) {
        const url = `/post/search?postId=${id}`;
        return axiosClient.get(url);
    }

    static async getPostByUserId(id) {
        const url = `/post/search?userId=${id}`;
        return axiosClient.get(url);
    }

    static async reactPost(id, data) {
        const url = `/post/reaction/${id}`;
        return axiosPrivate.put(url, data);
    }

    static async deletePost(id) {
        const url = `/post/${id}`;
        return axiosPrivate.delete(url);
    }
}

export default PostAPI;