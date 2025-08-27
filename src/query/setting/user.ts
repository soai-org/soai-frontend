import { useQuery, useMutation } from "@tanstack/react-query";
import axios from "@/query/axios";
import { User } from "@/types/user";
import { Pagination } from "@/types/pagination";

const paths = {
  user: "/users",
  userList: "/users/list",
  userCreate: "/users/add",
  userEdit: "/users/edit",
  userDelete: "/users/delete",
};

// Setting User 목록 호출 hook
export function useUserList({ page = 1, limit = 10 }: Pagination) {
  return useQuery({
    queryKey: [paths.user, page, limit],
    queryFn: async (): Promise<User[]> => {
      try {
        // 추후 페이지네이션 기능 추가하면 추가
        // const searchParams = new URLSearchParams({
        //   page: page.toString(),
        //   limit: limit.toString(),
        // });

        const res = await axios.get(`${paths.userList}`);
        return res.data as User[];
      } catch (error) {
        console.log(error);
        return [];
      }
    },
  });
}

// Setting User 생성 요청
export function useUserCreate() {
  return useMutation({
    mutationFn: async (user: User) => {
      try {
        const res = await axios.post(paths.userCreate, user);
        if (res.status == 200) return true;
        else {
          return false;
        }
      } catch (error) {
        throw error;
      }
    },
  });
}

// Setting User 삭제 요청
export function useUserDelete() {
  return useMutation({
    mutationFn: async (userId: string) => {
      try {
        const res = await axios.delete(`${paths.userDelete}/${userId}`);
        if (res.status == 200) return true;
        else {
          return false;
        }
      } catch (error) {
        throw error;
      }
    },
  });
}

// Setting User 업데이트 요청
export function useUserUpdate() {
  return useMutation({
    mutationFn: async (user: Partial<User> & Pick<User, "userId">) => {
      try {
        const res = await axios.put(`${paths.userEdit}`, user);
        if (res.status == 200) return true;
        else {
          return false;
        }
      } catch (error) {
        throw error;
      }
    },
  });
}
