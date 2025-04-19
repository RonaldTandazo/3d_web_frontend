import { For, Grid } from "@chakra-ui/react"
import ArtVerseGridItem from "./ArtVerseGridItem"

interface ArtVerseGridProps {
    artworks: any[];
    columns?: number;
}

const ArtVerseGrid = ({ artworks, columns = 7 }: ArtVerseGridProps) => {
    const templateColumns = `repeat(${columns}, auto)`;

    return (
        <Grid
            templateRows="repeat(auto, auto)"
            templateColumns={templateColumns}
            gap={1}
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