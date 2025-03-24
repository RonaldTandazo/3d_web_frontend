import { Grid } from "@chakra-ui/react"
import ArtVerseGridItem from "./ArtVerseGridItem"

const ArtVerseGrid = ({ items }: { items: any[] }) => {
    return (
        <Grid
            templateRows="repeat(auto, auto)"
            templateColumns="repeat(2, auto)"
            gap={1}
        >
            {items.map((item: any) => (
                <ArtVerseGridItem item={item} key={item.id} />
            ))}
        </Grid>
    )
}

export default ArtVerseGrid