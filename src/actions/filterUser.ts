import { FilteredUserInterface, UserInterface } from "src/utils/types"

export default (user: UserInterface): FilteredUserInterface => {
  const { id, name, email } = user
  return { id, name, email }
}
