
import LoadingProgress from "@/custom/Components/LoadingProgress";
import { Show } from "@chakra-ui/react";

const ArtworkEdit = () => {
    return (
        <Show when={true}>
            <LoadingProgress />
        </Show>
    )
}

export default ArtworkEdit;