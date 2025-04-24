import React, { useState, useRef, useEffect } from 'react';
import { Flex, Grid, GridItem, Text, Button, Menu, Portal, Icon, Separator, Popover, Group, Input, Field, Box } from '@chakra-ui/react';
import { GrMenu } from 'react-icons/gr';
import { AiFillEdit } from 'react-icons/ai';
import { TiDelete } from 'react-icons/ti';
import { useForm, Controller } from 'react-hook-form';
import IconsSocialMedia from './IconsSocialMedia';
import LoadingProgress from './LoadingProgress';
import SearchableSelect from './SearchableSelect';
import { useColorMode } from '@/components/ui/color-mode';
import { IoIosSave } from 'react-icons/io';
import { Tooltip } from "@/components/ui/tooltip"
import { useRemoveUserSocialNetowrk, useUpdateUserSocialNetowrk } from '@/services/UserSocialNetwork/UserSocialNetworkService';

interface SocialMediaItemProps {
    item: any;
    socialMedia: any[];
    socialMediaLoading: boolean;
}

interface SocialMediaFormValues {
    socialMediaId: number;
    link: string;
}

const SocialMediaListItem: React.FC<SocialMediaItemProps> = ({ item, socialMedia, socialMediaLoading }) => {
    const [menuOpen, setMenuOpen] = useState(false);
    const [popoverOpen, setPopoverOpen] = useState(false);
    const [editingId, setEditingId] = useState<number | null>(null);
    const buttonRef = useRef<HTMLButtonElement>(null);
    const buttonWidth = buttonRef.current?.offsetWidth || 100;
    const { colorMode } = useColorMode();
    const { updateUserNetwork: UpdateUserNetwork, error: updateUserNetworkError, loading: updateUserNetworkLoading } = useUpdateUserSocialNetowrk();
    const { removeUserNetwork: RemoveUserNetwork, data: removeUserNetworkData, error: removeUserNetworkError, loading: removeUserNetworkLoading } = useRemoveUserSocialNetowrk();

    const {
        register: editSocialMedia,
        handleSubmit: handleUpdateSocialMedia,
        formState: { errors: errorsUpdateSocialeMedia },
        control: updateSocialMediaControl,
    } = useForm<SocialMediaFormValues>();

    const handleEditClick = (item: any) => {
        setEditingId(item.userSocialNetworkId);
    };

    const handleClose = () => {
        setMenuOpen(false);
        setEditingId(null);
    };

    const removeSocialNetowrk = async (data: any) => {
        await RemoveUserNetwork(data.userSocialNetworkId)
        handleClose();
    }

    const onSubmitUpdateSocialMedia = handleUpdateSocialMedia(async (data: any) => {
        if(editingId){
            await UpdateUserNetwork(editingId, data.socialMediaId[0], data.link);
            handleClose();
        }
    });

    useEffect(() => {

    }, [updateUserNetworkError, removeUserNetworkError])

    if (removeUserNetworkData) return null;

    return (
        <React.Fragment key={item.userSocialNetworkId}>
            <Separator size="sm" />
            <Flex direction={'row'} key={item.userSocialNetworkId} justifyContent={'space-between'} alignItems={'center'} px={5} w={'full'}>
                <Grid w="full" templateColumns={editingId ? '30% 60% 10%' : '10% 80% 10%'} gap={4}>
                    {editingId === item.userSocialNetworkId ? (
                        <>
                            {updateUserNetworkLoading || removeUserNetworkLoading ? (
                                <LoadingProgress />
                            ) : (
                                <>
                                    <GridItem alignItems={'center'} display={'flex'} justifyContent={'flex-start'}>
                                        <Field.Root invalid={!!errorsUpdateSocialeMedia.socialMediaId} w={'15vw'}>
                                            <Controller
                                                control={updateSocialMediaControl}
                                                name="socialMediaId"
                                                rules={{ required: 'Social Network is required' }}
                                                render={({ field }) => (
                                                    <SearchableSelect disabled={socialMediaLoading} placeholder={'Select Social Netowrk'} options={socialMedia} field={field} multiple={false} defaultValue={item.socialMediaId} />
                                                )}
                                            />
                                            <Field.ErrorText>{errorsUpdateSocialeMedia.socialMediaId?.message}</Field.ErrorText>
                                        </Field.Root>
                                    </GridItem>
                                    <GridItem alignItems={'center'} display={'flex'} justifyContent={'flex-start'}>
                                        <Field.Root invalid={!!errorsUpdateSocialeMedia.link}>
                                            <Input {...editSocialMedia('link', { required: 'Link is required' })} defaultValue={item.link} />
                                            <Field.ErrorText>{errorsUpdateSocialeMedia.link?.message}</Field.ErrorText>
                                        </Field.Root>
                                    </GridItem>
                                    <GridItem alignItems={'center'} display={'flex'} justifyContent={'center'}>
                                        <Button type="submit" alignSelf={'flex-end'} bg={'cyan.600'} color={'white'} loading={false} disabled={false} onClick={onSubmitUpdateSocialMedia}>
                                            <IoIosSave />
                                        </Button>
                                    </GridItem>
                                </>
                            )}
                        </>
                    ) : (
                        <>
                            <GridItem alignItems={'center'} display={'flex'} justifyContent={'flex-start'}>
                                <IconsSocialMedia key={item.userSocialNetworkId} socialNetwork={item.network} link={item.link} size={'lg'} />
                            </GridItem>
                            <GridItem alignItems={'center'} display={'flex'} justifyContent={'flex-start'}>
                                <Text color="fg.muted">{item.link}</Text>
                            </GridItem>
                            <GridItem alignItems={'center'} display={'flex'} justifyContent={'center'}>
                                <Menu.Root unmountOnExit lazyMount open={menuOpen}>
                                    <Menu.Trigger asChild onClick={() => setMenuOpen(!menuOpen)}>
                                        <Button size={'md'} bg={'transparent'} color={colorMode === 'light' ? 'cyan.500' : 'pink.500'} ref={buttonRef}>
                                            <Icon size={'lg'}>
                                                <GrMenu />
                                            </Icon>
                                        </Button>
                                    </Menu.Trigger>
                                    <Portal>
                                        <Menu.Positioner>
                                            <Menu.Content minW={buttonWidth} style={{ minWidth: buttonWidth }}>
                                                <Tooltip
                                                    content="Edit"
                                                    openDelay={500}
                                                    closeDelay={100}
                                                    unmountOnExit={true}
                                                    lazyMount={true}
                                                    positioning={{ placement: 'top' }}
                                                    showArrow
                                                    contentProps={{
                                                        css: {
                                                            '--tooltip-bg': colorMode === 'light' ? 'colors.cyan.500' : 'colors.pink.500',
                                                            'color': 'white'
                                                        },
                                                    }}
                                                >
                                                    <Menu.Item value={'edit'} justifyContent={'center'} alignItems={'center'} onClick={() => handleEditClick(item)}>
                                                        <Icon size={'sm'} color={colorMode === 'light' ? 'cyan.500' : 'pink.500'}>
                                                            <AiFillEdit />
                                                        </Icon>
                                                    </Menu.Item>
                                                </Tooltip>
                                                <Separator my={1} />
                                                <Tooltip
                                                    content="Remove"
                                                    openDelay={500}
                                                    closeDelay={100}
                                                    unmountOnExit={true}
                                                    lazyMount={true}
                                                    positioning={{ placement: 'top' }}
                                                    showArrow
                                                    contentProps={{
                                                        css: {
                                                            '--tooltip-bg': 'tomato',
                                                            'color': 'white',
                                                        },
                                                    }}
                                                >
                                                    <Menu.Item value={'delete'} color="fg.error" _hover={{ bg: 'bg.error', color: 'fg.error' }} justifyContent={'center'} alignItems={'center'}>
                                                        <Popover.Root lazyMount unmountOnExit open={popoverOpen}>
                                                            <Popover.Trigger asChild onClick={() => setPopoverOpen(!popoverOpen)}>
                                                                <Icon size={'sm'}>
                                                                    <TiDelete />
                                                                </Icon>
                                                            </Popover.Trigger>
                                                            <Portal>
                                                                <Popover.Positioner>
                                                                    <Popover.Content>
                                                                        <Popover.Arrow />
                                                                        <Popover.Header fontWeight="bold" color={colorMode === 'light' ? 'black' : 'white'}>
                                                                            Remove
                                                                        </Popover.Header>
                                                                        <Popover.Body>
                                                                            <Text color={colorMode === 'light' ? 'black' : 'white'}>Are you sure you want to remove this Social Netowrk?</Text>
                                                                        </Popover.Body>
                                                                        <Popover.Footer justifyContent={'flex-end'}>
                                                                            <Group display={'flex'}>
                                                                                <Button
                                                                                    size="xs"
                                                                                    onClick={() => {
                                                                                        removeSocialNetowrk(item);
                                                                                        setPopoverOpen(false);
                                                                                        setMenuOpen(false);
                                                                                        setEditingId(item.userSocialNetworkId);
                                                                                    }}
                                                                                    bg={'tomato'}
                                                                                    color={'white'}
                                                                                >
                                                                                    Yes
                                                                                </Button>
                                                                                <Button size="xs" onClick={() => setPopoverOpen(false)} variant={'surface'} bg={'transparent'} color={colorMode === 'light' ? 'black' : 'white'}>
                                                                                    No
                                                                                </Button>
                                                                            </Group>
                                                                        </Popover.Footer>
                                                                    </Popover.Content>
                                                                </Popover.Positioner>
                                                            </Portal>
                                                        </Popover.Root>
                                                    </Menu.Item>
                                                </Tooltip>
                                            </Menu.Content>
                                        </Menu.Positioner>
                                    </Portal>
                                </Menu.Root>
                            </GridItem>
                        </>
                    )}
                </Grid>
            </Flex>
        </React.Fragment>
    );
};

export default SocialMediaListItem;