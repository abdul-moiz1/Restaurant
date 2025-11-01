import RoleSelector from "../RoleSelector";

export default function RoleSelectorExample() {
  return (
    <RoleSelector
      isOpen={true}
      onSelect={(role) => console.log("Selected role:", role)}
    />
  );
}
