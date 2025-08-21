import { For, Grid } from "@chakra-ui/react"
import ArtVerseGridItem from "./ArtVerseGridItem"

interface ArtVerseGridProps {
    artworks: any[];
}

const ArtVerseGrid = ({ artworks }: ArtVerseGridProps) => {
    const columns = 7;
    const templateColumns = `repeat(${columns}, 1fr)`;

    return (
        <Grid
            templateRows="repeat(auto, auto)"
            templateColumns={templateColumns}
            gap={1}
            w={"full"}
        >
            <For each={artworks}>
                {(artwork) => (
                    <ArtVerseGridItem artwork={artwork} key={artwork.artworkId} />
                )}
            </For>
        </Grid>
    )
}

export default ArtVerseGrid