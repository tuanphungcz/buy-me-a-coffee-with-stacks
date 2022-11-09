import {
  IconBrandGithub,
  IconBrandLinkedin,
  IconBrandTwitter,
  IconHome
} from '@tabler/icons';
import NewTabLink from './NewTabLink';

export default function Socials({ socialIcons }) {
  const socials = [
    {
      name: 'GitHub',
      href: socialIcons?.github,
      icon: IconBrandGithub
    },
    {
      name: 'LinkedIn',
      href: socialIcons?.linkedin,
      icon: IconBrandLinkedin
    },
    {
      name: 'Twitter',
      href: socialIcons?.twitter,
      icon: IconBrandTwitter
    },
    {
      name: 'Website',
      href: socialIcons?.website,
      icon: IconHome
    }
  ];

  return (
    <div className="flex items-center gap-6">
      {socials.map(
        item =>
          item?.href && (
            <NewTabLink key={item.name} href={item.href}>
              <div className="relative group">
                <item.icon className="relative z-50 w-6 text-gray-500 transition cursor-pointer hover:text-gray-900" />
                <div className="absolute z-0 transition scale-95 opacity-0 rounded-xl -inset-y-2 -inset-x-2 bg-zinc-50 group-hover:scale-100 group-hover:opacity-100 "></div>
              </div>
            </NewTabLink>
          )
      )}
    </div>
  );
}
