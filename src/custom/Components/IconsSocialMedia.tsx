import { Icon, Link } from "@chakra-ui/react";
import { FaDiscord, FaFacebook, FaInstagram, FaLink, FaLinkedin, FaPinterest, FaReddit, FaSnapchat, FaTiktok, FaTumblr, FaTwitch, FaTwitter, FaYoutube } from "react-icons/fa";
import { Tooltip } from "@/components/ui/tooltip"
import { useColorMode } from "@/components/ui/color-mode";
import { useState } from "react";

interface UserSocialNetworkProps {
    socialNetwork: string;
    link: string;
    size: "xs" | "sm" | "md" | "lg" | "xl" | "2xl";
}

const IconsSocialMedia = ({socialNetwork, link, size}: UserSocialNetworkProps) => {
    const { colorMode } = useColorMode()
    const prefixes = ['http://', 'https://'];
    let finalLink = String(link || '');
    let linkHasPrefix = false;

    for (const prefix of prefixes) {
        if (finalLink.toLowerCase().startsWith(prefix)) {
            linkHasPrefix = true;
            break;
        }
    }

    if (!linkHasPrefix && finalLink !== '') {
        finalLink = 'https://' + finalLink;
    }

    const getSocialNetworkIcon = (socialNetwork: string) => {
        switch (socialNetwork.toLowerCase()) {
            case 'facebook':
                return <FaFacebook/>
            case 'instagram':
                return <FaInstagram/>
            case 'x':
                return <FaTwitter/>
            case 'snapchat':
                return <FaSnapchat/>
            case 'tiktok':
                return <FaTiktok/>
            case 'youtube':
                return <FaYoutube/>
            case 'linkedin':
                return <FaLinkedin/>
            case 'pinterest':
                return <FaPinterest/>
            case 'reddit':
                return <FaReddit/>
            case 'tumblr':
                return <FaTumblr/>
            case 'twitch':
                return <FaTwitch/>
            case 'discord':
                return <FaDiscord/>
            default:
                return <FaLink/>
        }
    }

    const icono = getSocialNetworkIcon(socialNetwork)

    return icono ? (
        <Tooltip
            content={socialNetwork}
            openDelay={500}
            closeDelay={100}
            unmountOnExit={true}    
            lazyMount={true}
            positioning={{ placement: "top" }}
            showArrow
            contentProps={{ 
                css: { 
                    "--tooltip-bg": colorMode === "light" ? "colors.cyan.600":"colors.pink.600",
                    'color': 'white'
                }
            }}
        >    
            <Link href={finalLink} target="_blank" rel="noopener noreferrer" borderRadius={"full"}>
                <Icon size={size} color={colorMode === "light" ? "cyan.600":"pink.600"}>
                    {icono}
                </Icon>
            </Link>
        </Tooltip>
    ) : socialNetwork;
}

export default IconsSocialMedia;