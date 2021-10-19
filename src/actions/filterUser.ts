import { filteredUserType, userType } from "src/utils/types"

export default (user: userType): filteredUserType => {
  const { id, name, email } = user
  return { id, name, email }
}
