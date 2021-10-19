import { FilteredUser, UserType } from "src/utils/types"

export default (user: UserType): FilteredUser => {
  const { id, name, email } = user
  return { id, name, email }
}
