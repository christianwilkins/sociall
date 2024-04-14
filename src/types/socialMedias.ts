import { IconProps } from "@radix-ui/react-icons/dist/types";

export enum SocialMedias {
    Instagram = 'Instagram',
    Discord = 'Discord',
    Twitter = 'Twitter',
    LinkedIn = 'LinkedIn',
    Facebook = 'Facebook',
    Reddit = 'Reddit'
  }
  
  export type socialCard = {
    title: SocialMedias,
    description: string,
    content: string,
    footer: string
  }
  
  export type ResponseType = Pick<socialCard, 'description'> & {
    message: string
  };
  
  export type SomeSocialMedias = {
    [K in keyof typeof SocialMedias]?: React.ForwardRefExoticComponent<IconProps & React.RefAttributes<SVGSVGElement>>
  };
  