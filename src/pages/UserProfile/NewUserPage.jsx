import {
  Avatar as UiAvatar,
  AvatarFallback,
  AvatarImage,
} from "../../components/ui/avatar";
import { Button } from "../../components/ui/button";
import { Card, CardContent, CardHeader } from "../../components/ui/card";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../components/ui/select";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../../components/ui/tabs";
import { Textarea } from "../../components/ui/textarea";
import { CameraIcon, CreditCardIcon, LockIcon, UserIcon } from "lucide-react";
import { useEffect, useState, useRef } from "react";
import { message } from "antd";
import { supabase } from "../../supabase";
import { useAuth } from "../../context/AuthContext";
import LoadingButtonClick from "../../components/LoadingButtonClick";

const getBase64 = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });

function NewUserPage() {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [userData, setUserData] = useState({
    full_name: "",
    email: "",
    plan: "",
    subscribe: "",
    company: "",
    company_website: "",
    detail: "",
    roll: "Founder",
    avatar: null,
    interested_in: ["Technology"],
    investment_size: ["$0-$10,000"],
    country: ["US"],
    subscription_status: "",
    type: "Individual",
    revenueStatusWanted: "$0 - $10k",
    notification_count: 0,
    facebook: "",
    twitter: "",
    linkedin: "",
    next_billing_date: "",
    institutionalName: "",
    institutionalWebsite: "",
    teamSize: "1-10",
    amountRaised: "",
    operationTime: "",
    round: "",
    code: "",
  });

  const [avatarUrl, setAvatarUrl] = useState(userData.avatar);
  const [avatarFile, setAvatarFile] = useState(null); // To store the uploaded file
  const inputRef = useRef(null);

  useEffect(() => {
    async function fetchUserData() {
      try {
        if (!navigator.onLine) {
          message.error("No internet access.");
          return;
        }
        setIsLoading(true);
        const { data, error } = await supabase
          .from("users")
          .select("*")
          .eq("id", user.id)
          .single();

        if (error) {
          throw error;
        }

        if (data) {
          setUserData({
            full_name: data.full_name || "",
            email: data.email || "",
            plan: data.plan || "Free",
            subscribe: data.subscribe || "",
            company: data.company || "",
            company_website: data.company_website || "",
            detail: data.detail || "",
            roll: data.roll || "Founder",
            avatar: data.avatar || null,
            interested_in: data.interested_in || ["Technology"],
            investment_size: data.investment_size || ["$0-$10,000"],
            country: data.country || "US",
            type: data.type || "Individual",
            subscription_status: data.subscription_status || "",
            revenueStatusWanted: data.revenueStatusWanted || "$0 - $10k",
            notification_count: data.notification_count || 0,
            facebook: data.facebook || "",
            twitter: data.twitter || "",
            linkedin: data.linkedin || "",
            next_billing_date: data.next_billing_date || "",
            institutionalName: data.institutionalName || "",
            institutionalWebsite: data.institutionalWebsite || "",
            teamSize: data.teamSize || "1-10",
            amountRaised: data.amountRaised || "",
            operationTime: data.operationTime || "2024",
            round: data.round || "Pre-seed",
            code: data.code || "",
          });
          setAvatarUrl(data.avatar); // Set initial avatar URL
        }
      } catch (error) {
        message.error(error.message);
      }
      setIsLoading(false);
    }

    fetchUserData();
  }, [user.id]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserData((prevUserData) => ({
      ...prevUserData,
      [name]: value,
    }));
  };

  const handleAvatarChange = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const preview = await getBase64(file);
    setAvatarUrl(preview); // Show preview of the uploaded image
    setAvatarFile(file); // Set file for uploading later
  };

  const getTimestampFileName = () => {
    const timestamp = Date.now(); // Get the current timestamp
    return `${timestamp}.png`; // Return a file name like 'timestamp.png'
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      if (!navigator.onLine) {
        throw new Error("No internet access.");
      }

      let avatarUrlToSave = userData.avatar;

      if (avatarFile) {
        const fileName = getTimestampFileName(); // Generate the file name with the timestamp

        const { data: avatarData, error: avatarError } = await supabase.storage
          .from("beekrowd_storage") // Supabase bucket
          .upload(`beekrowd_images/${fileName}`, avatarFile); // Use the timestamp-based file name

        if (avatarError) {
          throw new Error("Avatar upload failed");
        }
        avatarUrlToSave = `https://dheunoflmddynuaxiksw.supabase.co/storage/v1/object/public/${avatarData.fullPath}`;
      }

      const { error } = await supabase
        .from("users")
        .update({
          full_name: userData.full_name,
          email: userData.email,
          plan: userData.plan,
          subscribe: userData.subscribe,
          company: userData.company,
          company_website: userData.company_website,
          detail: userData.detail,
          roll: userData.roll,
          avatar: avatarUrlToSave, // Update avatar URL in database
          interested_in: userData.interested_in,
          investment_size: userData.investment_size,
          country: userData.country,
          type: userData.type,
          revenueStatusWanted: userData.revenueStatusWanted,
          facebook: userData.facebook,
          twitter: userData.twitter,
          linkedin: userData.linkedin,
          next_billing_date: userData.next_billing_date,
          institutionalName: userData.institutionalName,
          institutionalWebsite: userData.institutionalWebsite,
          teamSize: userData.teamSize,
          amountRaised: userData.amountRaised,
          operationTime: userData.operationTime,
          round: userData.round,
          code: userData.code,
        })
        .eq("id", user.id);

      if (error) {
        throw new Error("Error updating user data: " + error.message);
      }

      message.success("Updated successfully!");
    } catch (error) {
      message.error(error.message);
    }
    setIsLoading(false);
  };

  const [currentPassword, setCurrentPassword] = useState(""); // New current password state
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handlePasswordChange = async () => {
    if (!currentPassword) {
      message.error("Please enter your current password.");
      return;
    }

    try {
      // Step 1: Re-authenticate the user with the current password
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: user.email,
        password: currentPassword, // Verifying the current password
      });

      if (signInError) {
        message.error("Current password is incorrect.");
        return;
      }

      // Step 2: Check if new password matches confirm password
      if (newPassword !== confirmPassword) {
        message.error("New passwords do not match.");
        return;
      }

      // Step 3: Update the password
      const { error } = await supabase.auth.updateUser({
        password: newPassword,
      });

      if (error) {
        message.error("Password update failed: " + error.message);
      } else {
        message.success("Password updated successfully.");
        setCurrentPassword(""); // Clear current password
        setNewPassword(""); // Clear new password fields
        setConfirmPassword("");
      }
    } catch (error) {
      message.error("An error occurred: " + error.message);
    }
  };

  return (
    <div className="min-h-screen py-12 px-3 sm:px-6 lg:px-8 mt-14">
      {isLoading && <LoadingButtonClick isLoading={isLoading} />}
      <div className="max-w-4xl mx-auto">
        <Card>
          <CardHeader>
            <div className="flex items-center space-x-4">
              <div className="relative">
                <UiAvatar className="w-24 h-24">
                  <AvatarImage
                    alt="User avatar"
                    src={avatarUrl || "/placeholder.svg?height=96&width=96"}
                  />
                  <AvatarFallback>PH</AvatarFallback>
                </UiAvatar>
                <input
                  type="file"
                  ref={inputRef}
                  accept="image/*"
                  onChange={handleAvatarChange}
                  style={{ display: "none" }} // Hidden input
                />
                <Button
                  size="icon"
                  className="absolute bottom-0 right-0 rounded-full bg-black text-white"
                  onClick={() => inputRef.current.click()} // Trigger file input click
                >
                  <CameraIcon className="h-4 w-4" />
                </Button>
              </div>
              <div>
                <h1 className="text-3xl font-bold -tracking-normal !mb-0">
                  {userData?.full_name?.toUpperCase() || "User Name"}
                </h1>
                <p className="text-muted-foreground text-base">
                  Member since:{" "}
                  {new Date(user.created_at).toISOString().split("T")[0]}
                </p>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-3">
            <Tabs defaultValue="user-info" className="space-y-6">
              <TabsList className="grid w-full grid-cols-3 gap-4">
                <TabsTrigger value="user-info">
                  <UserIcon className="mr-2 h-4 w-4" />
                  User Info
                </TabsTrigger>
                <TabsTrigger value="security">
                  <LockIcon className="mr-2 h-4 w-4" />
                  Security
                </TabsTrigger>
                <TabsTrigger value="billing">
                  <CreditCardIcon className="mr-2 h-4 w-4" />
                  Billing
                </TabsTrigger>
              </TabsList>

              {/* User Info Tab */}
              <TabsContent value="user-info" className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="full-name">Full name</Label>
                    <Input
                      id="full-name"
                      name="full_name"
                      value={userData.full_name}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" value={userData.email} readOnly />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="company">Company</Label>
                    <Input
                      id="company"
                      name="company"
                      value={userData.company}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="website">Company website</Label>
                    <Input
                      id="website"
                      name="company_website"
                      value={userData.company_website}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="role">Role</Label>
                    <Select
                      value={userData.roll} // Bind the value to userData.roll
                      onValueChange={
                        (value) =>
                          setUserData((prevUserData) => ({
                            ...prevUserData,
                            roll: value,
                          })) // Update userData.roll when a new value is selected
                      }
                    >
                      <SelectTrigger id="role">
                        <SelectValue placeholder="Select a role" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="founder">Founder</SelectItem>
                        <SelectItem value="employee">Employee</SelectItem>
                        <SelectItem value="investor">Investor</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="premium-code">FundFlow Premium code</Label>
                    <Input
                      id="premium-code"
                      name="code"
                      value={userData.code}
                      onChange={handleInputChange}
                      placeholder="Enter premium code"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="about">Tell something about you</Label>
                  <Textarea
                    id="about"
                    name="detail"
                    value={userData.detail}
                    onChange={handleInputChange}
                    placeholder="Tell us about yourself"
                    className="min-h-[100px]"
                  />
                </div>
                <Button className="bg-black text-white" onClick={handleSubmit}>
                  Save Changes
                </Button>
              </TabsContent>

              {/* Security Tab */}
              <TabsContent value="security" className="space-y-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="current-password">Current Password</Label>
                    <Input
                      id="current-password"
                      type="password"
                      placeholder="Enter current password"
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="new-password">New Password</Label>
                    <Input
                      id="new-password"
                      type="password"
                      placeholder="Enter new password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="confirm-password">
                      Confirm New Password
                    </Label>
                    <Input
                      id="confirm-password"
                      type="password"
                      placeholder="Confirm new password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                    />
                  </div>
                </div>
                <Button
                  onClick={handlePasswordChange}
                  className="bg-black text-white"
                >
                  Update Password
                </Button>
              </TabsContent>
              {/* Billing Tab */}
              <TabsContent value="billing" className="space-y-6">
                <Card>
                  <CardHeader>
                    <h3 className="text-lg font-semibold">
                      Subscription Details
                    </h3>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="plan">Plan</Label>
                        <Input
                          id="plan"
                          value={userData.plan}
                          readOnly
                          className="bg-muted"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="subscribe-date">Subscribe date</Label>
                        <Input
                          id="subscribe-date"
                          value={
                            userData.subscribe ||
                            new Date(user.created_at)
                              .toISOString()
                              .split("T")[0]
                          }
                          readOnly
                          className="bg-muted"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="subscription-status">
                          Subscription status
                        </Label>
                        <Input
                          id="subscription-status"
                          value={
                            userData.subscription_status
                              .trim()
                              .charAt(0)
                              .toUpperCase() +
                              userData.subscription_status.slice(1) || "Active"
                          }
                          readOnly
                          className="bg-muted"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="next-billing-date">
                          Next billing date
                        </Label>
                        <Input
                          id="next-billing-date"
                          value={userData.next_billing_date || "N/A"}
                          readOnly
                          className="bg-muted"
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default NewUserPage;
