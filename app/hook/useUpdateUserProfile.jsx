import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { updateMemberAction } from "../_lib/actions";

function useUpdateUserProfile() {
  return useMutation({
    mutationFn: updateMemberAction,
    onSuccess: () => {
      toast.success("User profile successfully updated");
    },
    onError: (error) => {
      toast.error("User profile update failed");
      console.log(error);
    },
  });
}
export default useUpdateUserProfile;
