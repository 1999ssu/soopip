import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface DropdownOption {
  subTitle: string;
  items: {
    label: string;
    onClick?: () => void;
    shortcut?: string;
  }[];
}

interface DropdownButtonProps {
  buttonContent: React.ReactNode; // 아이콘/문자/둘 다 가능
  options: DropdownOption[];
  width?: string;
}

const DropdownButton = ({
  buttonContent,
  options,
  width,
}: DropdownButtonProps) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline">{buttonContent}</Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent className={width ?? "w-56"} align="start">
        {options.map((group) => (
          <DropdownMenuGroup key={group.subTitle}>
            <DropdownMenuLabel>{group.subTitle}</DropdownMenuLabel>

            {group.items.map((item) => (
              <DropdownMenuItem key={item.label} onClick={item.onClick}>
                <span>{item.label}</span>
                {item.shortcut && (
                  <span className="ml-auto opacity-50">{item.shortcut}</span>
                )}
              </DropdownMenuItem>
            ))}

            <DropdownMenuSeparator />
          </DropdownMenuGroup>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
export default DropdownButton;
