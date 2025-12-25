import { getUserAction } from "@/app/_lib/actions";
import { useQuery } from "@tanstack/react-query";
function useUser() {

  return useQuery({
    queryKey: ["user"],
    queryFn: getUserAction
  });

}
