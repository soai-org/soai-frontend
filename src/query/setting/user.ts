import { useQuery, useMutation } from "@tanstack/react-query";
import axios from "@/query/axios";
import { User } from "@/types/user";
import { getSession } from "next-auth/react";

interface Pagination {
  offset: number;
  limit: number;
}

const paths = {
  user: "/users",
  userList: "/users/list",
  userCreate: "/users/add",
  userEdit: "/users/edit",
  userDelete: "/users/delete",
};

// Setting User 목록 호출 hook
export function useUserList({ offset = 0, limit = 10 }: Pagination) {
  return useQuery({
    queryKey: [paths.user, offset, limit],
    queryFn: async (): Promise<User[]> => {
      try {
        const session = await getSession();

        if (!session) {
          throw new Error("세션이 없습니다.");
        }

        const res = await axios.get(`${paths.userList}`, {
          headers: { Authorization: `Bearer ${session.accessToken}` },
        });
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
        const session = await getSession();

        if (!session) {
          throw new Error("세션이 없습니다.");
        }
        const res = await axios.post(paths.userCreate, user, {
          headers: { Authorization: `Bearer ${session.accessToken}` },
        });
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
        const session = await getSession();

        if (!session) {
          throw new Error("세션이 없습니다.");
        }

        const res = await axios.delete(`${paths.userDelete}/${userId}`, {
          headers: { Authorization: `Bearer ${session.accessToken}` },
        });
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
        const session = await getSession();

        if (!session) {
          throw new Error("세션이 없습니다.");
        }

        const res = await axios.put(`${paths.userEdit}`, user, {
          headers: { Authorization: `Bearer ${session.accessToken}` },
        });
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
