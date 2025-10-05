import { useEffect } from "react";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import PageMeta from "../../components/common/PageMeta";
import { useParams } from 'react-router-dom';
import ChatUI from "../../components/chats/ChatUI";
import { useToken } from "../../hooks/useToken";

const AIChat: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const token = useToken();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(import.meta.env.VITE_API_URL + `/chat/getChat/${id}`, {
          method: "GET",
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        const data = await res.json();
        console.log(data)
      } catch (error) {
        console.error('Błąd przy pobieraniu danych:', error);
      } finally {
        // setLoading(false);
      }
    }
    fetchData();
  }, []);

  return (
    <>
      <PageMeta
        title="React.js Profile Dashboard | TailAdmin - Next.js Admin Dashboard Template"
        description="This is React.js Profile Dashboard page for TailAdmin - React.js Tailwind CSS Admin Dashboard Template"
      />
      <PageBreadcrumb pageTitle="VPS Details" />
      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] lg:p-6">
        <ChatUI />
      </div>
    </>
  )
}

export default AIChat;