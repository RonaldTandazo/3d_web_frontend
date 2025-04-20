import { For, Grid } from "@chakra-ui/react"
import ArtVerseGridItem from "./ArtVerseGridItem"

interface ArtVerseGridProps {
    artworks: any[];
}

const ArtVerseGrid = ({ artworks }: ArtVerseGridProps) => {
    const max = 9
    const columns = artworks.length > max ? max:artworks.length
    const templateColumns = `repeat(${columns}, auto)`;

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