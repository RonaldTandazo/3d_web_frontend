import { useState, useEffect, ChangeEvent } from "react";
import { Canvas, useLoader } from "@react-three/fiber";
import { OBJLoader, MTLLoader } from "three-stdlib";
import { Box, Button, FileUpload, Heading, Icon, Show } from "@chakra-ui/react";
import { LuUpload } from "react-icons/lu";
import { useGLTF, OrbitControls } from '@react-three/drei';
import LoadingProgress from "@/custom/Components/LoadingProgress";

function ModeloOBJ({ objUrl, mtlUrl, setLoading }) {
    const obj = useLoader(OBJLoader, objUrl);
    const materials = useLoader(MTLLoader, mtlUrl);

    useEffect(() => {
        if (materials) {
            materials.preload();
            obj.children.forEach((child) => {
                //if (child instanceof THREE.Mesh) {
                    if (Array.isArray(child.material)) {
                        child.material = child.material.map((mat) => {
                            if (mat && mat.name && materials.materials[mat.name]) {
                                return materials.materials[mat.name];
                            }
                            return mat;
                        });
                    } else if (child.material && child.material.name && materials.materials[child.material.name]) {
                        child.material = materials.materials[child.material.name];
                    }
                //}
            })
        }

        setLoading(false)
    }, [obj, materials]);

    return <primitive object={obj} dispose={null} />;
}

function Escena3D({ objUrl, mtlUrl, setLoading }) {
    return (
        <Canvas>
            <ambientLight intensity={0.5} />
            <directionalLight position={[10, 10, 5]} />
            {objUrl && mtlUrl && <ModeloOBJ objUrl={objUrl} mtlUrl={mtlUrl} setLoading={setLoading}/>}
            <OrbitControls />
        </Canvas>
    );
}

const Viewer = () => {
    const [objUrl, setObjUrl] = useState(null);
    const [mtlUrl, setMtlUrl] = useState(null);
    const [loading, setLoading] = useState(false);

    const handleObjFileChange = (event: ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file && file.name.endsWith(".obj")) {
            setObjUrl(URL.createObjectURL(file));
        }
    };

    const handleMtlFileChange = (event: ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file && file.name.endsWith(".mtl")) {
            setMtlUrl(URL.createObjectURL(file));
            setLoading(true)
        }
    };

    const removeFiles = () => {
        if (objUrl) URL.revokeObjectURL(objUrl);
        if (mtlUrl) URL.revokeObjectURL(mtlUrl);
        setObjUrl(null);
        setMtlUrl(null);
    };

    return (
        <Box w={"auto"} h={"auto"} mx={5}>
            <Heading mb={4}>Visualización de Modelo 3D Cargado por el Usuario</Heading>
            <Box display={"flex"} w={"full"} justifyContent={"space-around"}>
                <FileUpload.Root maxW="xl" alignItems="stretch" maxFiles={1}>
                    <FileUpload.HiddenInput onChange={handleObjFileChange} />
                    <FileUpload.Dropzone>
                        <Icon size="md" color="fg.muted">
                            <LuUpload />
                        </Icon>
                        <FileUpload.DropzoneContent>
                            <Box>Drag and drop OBJ file here</Box>
                            <Box color="fg.muted">.obj up to 5MB</Box>
                        </FileUpload.DropzoneContent>
                    </FileUpload.Dropzone>
                    <FileUpload.List />
                </FileUpload.Root>
                {objUrl && (
                    <FileUpload.Root maxW="xl" alignItems="stretch" maxFiles={1}>
                        <FileUpload.HiddenInput onChange={handleMtlFileChange} />
                        <FileUpload.Dropzone>
                            <Icon size="md" color="fg.muted">
                                <LuUpload />
                            </Icon>
                            <FileUpload.DropzoneContent>
                                <Box>Drag and drop MTL file here</Box>
                                <Box color="fg.muted">.mtl up to 5MB</Box>
                            </FileUpload.DropzoneContent>
                        </FileUpload.Dropzone>
                        <FileUpload.List />
                    </FileUpload.Root>
                )}
            </Box>
            <Box display={"flex"} justifySelf={"center"} alignItems={"center"} w={"75vw"} h={"54vh"} border="1px solid #ccc" borderRadius="md" overflow="hidden" mt={4}>
                <Show when={loading}>
                    <Box w={"full"} h={"full"} justifyContent={"center"} alignItems={"center"}>
                        <LoadingProgress />
                    </Box>
                </Show>
                <Show when={objUrl && mtlUrl}>
                    <Escena3D objUrl={objUrl} mtlUrl={mtlUrl} setLoading={setLoading} />
                </Show>
            </Box>
            <Show when={objUrl || mtlUrl}>
                <Button mt={4} onClick={removeFiles}>
                    Limpiar
                </Button>
            </Show>
        </Box>
    );
};

export default Viewer;