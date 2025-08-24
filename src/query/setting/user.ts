import { useQuery, useMutation } from "@tanstack/react-query";
import axios from "@/query/axios";
import { User } from "@/types/user";

const paths = {
  user: "/setting/user",
  userList: "/setting/user",
  userCreate: "/setting/user",
};

// Setting User 목록 호출 hook
export function useUserList() {
  return useQuery({
    queryKey: [paths.user],
    queryFn: async (): Promise<User[]> => {
      try {
        const res = await axios.get(paths.user);
        return res.data;
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
        console.log(error);
        return false;
      }
    },
  });
}

// Setting User 삭제 요청
export function useUserDelete() {
  return useMutation({
    mutationFn: async (id: number) => {
      try {
        const res = await axios.delete(`${paths.user}/${id}`);
        if (res.status == 200) return true;
        else {
          return false;
        }
      } catch (error) {
        console.log(error);
        return false;
      }
    },
  });
}

// Setting User 업데이트 요청
export function useUserUpdate() {
  return useMutation({
    mutationFn: async (user: Partial<User> & Pick<User, "id">) => {
      try {
        const res = await axios.patch(`${paths.user}`, user);
        if (res.status == 200) return true;
        else {
          return false;
        }
      } catch (error) {
        console.log(error);
        return false;
      }
    },
  });
}
