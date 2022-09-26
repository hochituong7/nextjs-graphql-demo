import React from "react";
import prisma from "../../lib/prisma";
import { useState } from "react";
import { gql, useMutation } from "@apollo/client";
import toast, { Toaster } from "react-hot-toast";
import { useRouter } from "next/router";
import { useForm } from "react-hook-form";

const UpdateLinkMutation = gql`
  mutation (
    $id: ID!
    $title: String!
    $url: String!
    $imageUrl: String!
    $category: String!
    $description: String!
  ) {
    updateLink(
      id: $id
      title: $title
      url: $url
      imageUrl: $imageUrl
      category: $category
      description: $description
    ) {
      title
      url
      imageUrl
      category
      description
    }
  }
`;
const DeleteLinkMutation = gql`
  mutation ($id: ID!) {
    deleteLink(id: $id) {
      title
      url
      imageUrl
      category
      description
    }
  }
`;

const Link = ({ link }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [deleteLinkMutation] = useMutation(DeleteLinkMutation);
  const [updateLink, { loading, error }] = useMutation(UpdateLinkMutation, {
    onCompleted: () => reset(),
  });
  const [isRefreshing, setIsRefreshing] = React.useState(false);
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();

  const onSubmit = async (data) => {
    const { title, url, category, description } = data;
    const imageUrl = `https://via.placeholder.com/300`;
    const variables = { title, url, category, description, imageUrl };
    try {
      setIsLoading(true);
      toast.promise(updateLink({ variables: { id: link.id, ...variables } }), {
        loading: "Update new link..",
        success: "Link successfully Updated!🎉",
        error: `Something went wrong 😥 Please try again -  ${Error}`,
      });
      router.push(`/link/${link.id}`);
      setIsLoading(false);
    } catch (error) {
      console.error(error);
    }
  };

  const deleteItem = async (id: string) => {
    try {
      await deleteLinkMutation({ variables: { id: link.id } }).then((_res) =>

        );
        router.push("/");
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="container mx-auto max-w-md py-12">
      <Toaster />
      <h1 className="text-3xl font-medium my-5">Update link</h1>
      <form
        className="grid grid-cols-1 gap-y-6 shadow-lg p-8 rounded-lg"
        onSubmit={handleSubmit(onSubmit)}
      >
        <label className="block">
          <span className="text-gray-700">Title</span>
          <input
            placeholder="Title"
            name="title"
            type="text"
            defaultValue={link.title}
            {...register("title", { required: true })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
          />
        </label>

        <label className="block">
          <span className="text-gray-700">Description</span>
          <input
            placeholder="Description"
            {...register("description", { required: true })}
            name="description"
            type="text"
            defaultValue={link.description}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
          />
        </label>
        <label className="block">
          <span className="text-gray-700">Image</span>
          <img src={link.imageUrl} className="shadow-lg rounded-lg" />
        </label>
        <label className="block">
          <span className="text-gray-700">Url</span>
          <input
            placeholder="https://example.com"
            {...register("url", { required: true })}
            name="url"
            type="text"
            defaultValue={link.url}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
          />
        </label>
        <label className="block">
          <span className="text-gray-700">Category</span>
          <input
            placeholder="Name"
            {...register("category", { required: true })}
            name="category"
            type="text"
            defaultValue={link.category}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
          />
        </label>

        <button
          disabled={loading}
          type="submit"
          className="my-4 capitalize bg-blue-500 text-white font-medium py-2 px-4 rounded-md hover:bg-blue-600"
        >
          {loading ? (
            <span className="flex items-center justify-center">
              <svg
                className="w-6 h-6 animate-spin mr-1"
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M11 17a1 1 0 001.447.894l4-2A1 1 0 0017 15V9.236a1 1 0 00-1.447-.894l-4 2a1 1 0 00-.553.894V17zM15.211 6.276a1 1 0 000-1.788l-4.764-2.382a1 1 0 00-.894 0L4.789 4.488a1 1 0 000 1.788l4.764 2.382a1 1 0 00.894 0l4.764-2.382zM4.447 8.342A1 1 0 003 9.236V15a1 1 0 00.553.894l4 2A1 1 0 009 17v-5.764a1 1 0 00-.553-.894l-4-2z" />
              </svg>
              Updating...
            </span>
          ) : (
            <span>Update Link</span>
          )}
        </button>
      </form>
      <button
        className="my-4 capitalize bg-blue-500 text-white font-medium py-2 px-4 rounded-md hover:bg-blue-600"
        onClick={(evt) => deleteItem(link.id)}
      >
        Delete
      </button>
    </div>
  );
};

export default Link;

export const getServerSideProps = async ({ params }) => {
  const id = params.id;
  const link = await prisma.link.findUnique({
    where: { id },
    select: {
      id: true,
      title: true,
      category: true,
      url: true,
      imageUrl: true,
      description: true,
    },
  });

  return {
    props: {
      link,
    },
  };
};
