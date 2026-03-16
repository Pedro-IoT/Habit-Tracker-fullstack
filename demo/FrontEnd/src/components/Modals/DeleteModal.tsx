import { AlertDialog, Button, Flex } from "@radix-ui/themes";

type AlertModalProps = {
    onAction: () => void;
    trigger: React.ReactNode;
};

export const AlertModal = ({ onAction, trigger }: AlertModalProps) => {
    return (
        <AlertDialog.Root>
            <AlertDialog.Trigger>
                {trigger}
            </AlertDialog.Trigger>
            <AlertDialog.Content>
                <AlertDialog.Title>Delete Habit</AlertDialog.Title>
                <AlertDialog.Description size="2">
                    Are you sure you want to delete this habit? This won't be recoverable.
                </AlertDialog.Description>
                <Flex gap="3" mt="4" justify="end">
                    <AlertDialog.Cancel>
                        <Button variant="soft" color="gray">
                            Cancel
                        </Button>
                    </AlertDialog.Cancel>
                    <AlertDialog.Action onClick={onAction}>
                        <Button variant="solid" color="red">
                            Delete
                        </Button>
                    </AlertDialog.Action>
                </Flex>
            </AlertDialog.Content>
        </AlertDialog.Root>
    );
};