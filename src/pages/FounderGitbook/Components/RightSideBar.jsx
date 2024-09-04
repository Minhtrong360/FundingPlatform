import { Button } from "../../..//components/ui/button";
import { Input } from "../../..//components/ui/input";
import { Card, CardContent } from "../../..//components/ui/card";
import { Badge } from "../../..//components/ui/badge";

export default function RightSideBar({ company, currentProject }) {
  console.log("company", company);
  console.log("currentProject", currentProject);
  return (
    <div className="space-y-6 sm:mt-24 mt-16">
      <div className="relative">
        <Input type="search" placeholder="Search..." className="pr-8" />
        <svg
          className="absolute right-2 top-2.5 h-4 w-4 text-muted-foreground"
          fill="none"
          height="24"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          viewBox="0 0 24 24"
          width="24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <circle cx="11" cy="11" r="8" />
          <path d="m21 21-4.3-4.3" />
        </svg>
      </div>

      <Card>
        <CardContent className="p-4">
          <h4 className="font-semibold mb-2">Categories:</h4>
          <ul className="space-y-1">
            {company?.industry?.map((category) => (
              <li key={category} className="ml-2">
                - {category}
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-4">
          <h4 className="font-semibold mb-2">Recent Posts:</h4>
          <ul className="space-y-4">
            {[
              {
                title: "7 businesses for easy money",
                date: "June 18, 2024",
                image: "/placeholder.svg?height=40&width=40",
              },
              {
                title: "My 3 tips for business ideas",
                date: "June 18, 2024",
                image: "/placeholder.svg?height=40&width=40",
              },
              {
                title: "12 Halloween costume ideas",
                date: "June 18, 2024",
                image: "/placeholder.svg?height=40&width=40",
              },
            ].map((post, index) => (
              <li key={index} className="flex items-start space-x-2">
                <img
                  src={post.image}
                  alt=""
                  className="w-10 h-10 object-cover"
                />
                <div>
                  <p className="text-sm font-medium">{post.title}</p>
                  <p className="text-xs text-muted-foreground">{post.date}</p>
                </div>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>

      <div>
        <h4 className="font-semibold mb-2">Tags:</h4>
        <div className="flex flex-wrap gap-2">
          {company.keyWords.split(",").map((keyWord, index) => {
            const trimmedKeyword = keyWord.trim();
            if (trimmedKeyword) {
              const capitalizedKeyword =
                trimmedKeyword.charAt(0).toUpperCase() +
                trimmedKeyword.slice(1);
              return (
                <Badge key={index} className="bg-gray-100">
                  {capitalizedKeyword}
                </Badge>
              );
            }
            return null;
          })}
        </div>
      </div>

      <Card className="bg-black text-white">
        <CardContent className="p-4">
          <h4 className="font-semibold mb-2 text-white">
            How can we help you?
          </h4>
          <p className="text-sm mb-4">
            We are here to help you! Tell us how we can help and we'll get in
            touch within next 24hrs
          </p>
          <Button className="w-full bg-gray-100 hover:bg-gray-300 text-black">
            Contact Us
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
