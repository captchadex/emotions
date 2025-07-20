import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import { formatResponse } from "@/lib/format-response";
import { FormattedResponse } from "@/components/formatted-response";
import { Loader } from "@/components/ui/loader";

interface FormData {
  query: string;
}

export default function App() {
  const [response, setResponse] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const form = useForm<FormData>({
    defaultValues: {
      query: "",
    },
  });

  const onSubmit = async (data: FormData) => {
    try {
      setIsLoading(true);
      const response = await fetch("http://localhost:3000/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: data.query,
        }),
      });

      if (!response.ok) {
        console.error("Failed to fetch data");
        return;
      }

      const result = await response.json();
      setResponse(result.response);
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto p-4 space-y-4">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="flex gap-2">
          <FormField
            control={form.control}
            name="query"
            render={({ field }) => (
              <FormItem className="flex-1">
                <FormControl>
                  <div className="relative">
                    <Input placeholder="How are you feeling...?" {...field} />
                  </div>
                </FormControl>
              </FormItem>
            )}
          />
          <Button type="submit" className="cursor-pointer" disabled={isLoading}>
            {isLoading ? <Loader /> : "Send"}
          </Button>
        </form>
      </Form>
      <div className="rounded-lg border p-4 bg-muted/50 min-h-[100px] flex items-center justify-center">
        {isLoading ? (
          <Loader />
        ) : response ? (
          <FormattedResponse blocks={formatResponse(response)} />
        ) : (
          <p className="text-muted-foreground">How are you feeling?</p>
        )}
      </div>
    </div>
  );
}
