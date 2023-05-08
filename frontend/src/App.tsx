import { useCallback, useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import { FaEdit, FaTrashAlt } from 'react-icons/fa';

type Status = '未着手' | '着手中' | '完了';

type Todo = {
  id: number;
  title: string;
  description: string;
  status: Status | '';
};

type TodoListResponse = {
  Todo: {
    id: number;
    title: string;
    description: string;
  };
};

function App() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState('');
  const [todoList, setTodoList] = useState<Todo[]>([]);
  const [isEdit, setIsEdit] = useState(false);
  const [editId, setEditId] = useState(0);
  const ref = useRef<HTMLLabelElement>(null);

  const handleChangeTitle = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(e.target.value);
  }, []);

  const handleChangeDetail = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setDescription(e.target.value);
  }, []);

  const handleChangeStatus = useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
    setStatus(e.target.value);
  }, []);

  // statusの値がStatus型の値かどうかをチェックする関数
  const handleCheckStatusValue = (status: unknown): status is Status => {
    if (status === '未着手' || status === '着手中' || status === '完了') {
      return true;
    }
    return false;
  };

  const getAllTodo = () => {
    fetch('http://localhost:8080/todos', {
      mode: 'cors',
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then((res) => {
        return res.json() as Promise<TodoListResponse[]>;
      })
      .then((data) => {
        // デバッグ用に出力
        console.log(data);

        const displayTodoList = data.map((todo) => {
          return {
            id: todo.Todo.id,
            title: todo.Todo.title,
            description: todo.Todo.description,
            status: '未着手' as Status,
          };
        });
        setTodoList(displayTodoList);
      })
      .catch((err) => {
        alert(err);
      });
  };

  useEffect(() => {
    getAllTodo();
  }, []);

  const handleSubmit = useCallback((title: string, description: string, status: string) => {
    // if (!handleCheckStatusValue(status)) return;

    fetch('http://localhost:8080/create', {
      mode: 'cors',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ title, description }),
    })
      .then((res) => {
        getAllTodo();
        if (res.status === 400) {
          return res.json();
        }
        return;
      })
      .then((data) => {
        if (data === undefined) return;
        alert(data.message);
      })
      .catch((err) => alert(err));

    // 各種フォームの初期化
    setTitle('');
    setDescription('');
    setStatus('');
  }, []);

  // 編集フォームまでスクロールする関数
  const scrollToEditForm = useCallback(() => {
    if (ref.current === null) return;

    ref.current.scrollIntoView({
      behavior: 'smooth',
      block: 'center',
    });
  }, [ref]);

  const handleSwitchEdit = (id: number) => {
    setIsEdit(true);
    setEditId(id);
    scrollToEditForm();
  };

  const handleCancelEdit = () => {
    setIsEdit(false);
  };

  const handleUpdate = useCallback((id: number, title: string, description: string) => {
    fetch('http://localhost:8080/update', {
      mode: 'cors',
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ id, title, description }),
    })
      .then((res) => {
        getAllTodo();
        if (res.status === 400) {
          return res.json();
        }
        setIsEdit(false);
        return;
      })
      .then((data) => {
        if (data === undefined) return;
        alert(data.message);
      })
      .catch((err) => alert(err));
  }, []);

  const handleDelete = useCallback((id: number) => {
    fetch('http://localhost:8080/delete', {
      mode: 'cors',
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ id }),
    })
      .then((res) => {
        getAllTodo();
        if (res.status === 400) {
          return res.json();
        }
        return;
      })
      .then((data) => {
        if (data === undefined) return;
        alert(data.message);
      })
      .catch((err) => alert(err));
  }, []);

  return (
    <SWrapper>
      <SHeader>GOGO TODO APP</SHeader>
      <SContainer>
        <SContentContainer>
          <SFormWrapper>
            <SLabel htmlFor="title">Title</SLabel>
            <SInput
              id="title"
              type="text"
              placeholder="タイトルを入力してください"
              value={title}
              onChange={handleChangeTitle}
            />
          </SFormWrapper>
          <SFormWrapper>
            <SLabel htmlFor="detail">Detail</SLabel>
            <STextarea
              id="detail"
              placeholder="詳細を入力してください"
              value={description}
              onChange={handleChangeDetail}
            />
          </SFormWrapper>
          <SFormWrapper>
            <SLabel>Status</SLabel>
            <SSelect value={status} onChange={handleChangeStatus}>
              <SOption value="未着手">未着手</SOption>
              <SOption value="着手中">着手中</SOption>
              <SOption value="完了">完了</SOption>
            </SSelect>
          </SFormWrapper>
          <SButton onClick={() => handleSubmit(title, description, status)}>追加</SButton>
        </SContentContainer>
        {isEdit && (
          <SContentContainer>
            <SFormWrapper>
              <SLabel htmlFor="edit-title" ref={ref}>
                EditTitle
              </SLabel>
              <SInput
                id="edit-title"
                type="text"
                placeholder="タイトルを入力してください"
                value={title}
                onChange={handleChangeTitle}
              />
            </SFormWrapper>
            <SFormWrapper>
              <SLabel htmlFor="edit-detail">EditDetail</SLabel>
              <STextarea
                id="edit-detail"
                placeholder="詳細を入力してください"
                value={description}
                onChange={handleChangeDetail}
              />
            </SFormWrapper>
            <SButtonWrapper>
              <SButton onClick={() => handleUpdate(editId, title, description)}>編集</SButton>
              <SButton onClick={handleCancelEdit}>キャンセル</SButton>
            </SButtonWrapper>
          </SContentContainer>
        )}
        <SContentContainer>
          <STable>
            <STableHeader>
              <STableHeaderItemTitle>TITLE</STableHeaderItemTitle>
              <STableHeaderItemButton>STATUS</STableHeaderItemButton>
              <STableHeaderItemIcon></STableHeaderItemIcon>
              <STableHeaderItemIcon></STableHeaderItemIcon>
            </STableHeader>
            <STableBody>
              {todoList.map((todo, index) => (
                <STableBodyItem key={index}>
                  <STitleDisplay>{todo.title}</STitleDisplay>
                  <SButton>{todo.status}</SButton>
                  <FaEdit onClick={() => handleSwitchEdit(todo.id)} size="1.5em" />
                  <FaTrashAlt onClick={() => handleDelete(todo.id)} size="1.5em" />
                </STableBodyItem>
              ))}
            </STableBody>
          </STable>
        </SContentContainer>
      </SContainer>
      <SFooter>&copy;2023 Shogo Wada</SFooter>
    </SWrapper>
  );
}

const SWrapper = styled.div`
  display: grid;
  background-color: #333;
  width: 100%;
`;

const SContainer = styled.div`
  background-color: #333;
  width: 100%;
  max-width: 375px;
  padding-inline: 16px;
  margin: 4em auto 0 auto;
`;

const SContentContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1em;
  width: 100%;
  margin-bottom: 24px;
`;

const SHeader = styled.div`
  background-color: #87cefa;
  width: 100%;
  height: 50px;
  position: sticky;
  top: 0;
  z-index: 999;
  font-size: 1.5em;
  font-weight: bold;
  padding-left: 0.5em;
  padding-block: 0.5em;
`;

const SFooter = styled.footer`
  background-color: #fff;
  width: 100%;
  height: 50px;
  text-align: center;
  padding-block: 8px;
  margin-top: 16em;
`;

const SFormWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1em;
  width: 100%;
  max-width: 343px;
`;

const SInput = styled.input`
  width: 100%;
  max-width: 343px;
  min-height: 45px;
  border: none;
  border-radius: 8px;
  padding: 0.5em;
`;

const STextarea = styled.textarea`
  width: 100%;
  max-width: 343px;
  min-height: 200px;
  border: none;
  border-radius: 8px;
  padding: 0.5em;
`;

const SSelect = styled.select`
  width: 100%;
  max-width: 343px;
  min-height: 45px;
  border: none;
  border-radius: 8px;
  padding: 0.5em;
`;

const SOption = styled.option`
  width: 100%;
  max-width: 343px;
`;

const SLabel = styled.label`
  display: inline-block;
  width: 100%;
  max-width: 120px;
  border-radius: 8px;
  background-color: #fff;
  text-align: center;
  font-weight: bold;
`;

const STable = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
`;

const STableHeader = styled.div`
  display: flex;
  flex-direction: row;
  gap: 0.5em;
  width: 100%;
  border-bottom: 2px solid #cccc;
  background-color: #4da6ff;
  padding-inline: 8px;
`;

const STableHeaderItemTitle = styled.div`
  font-weight: bold;
  width: 10em;
`;

const STableHeaderItemButton = styled.div`
  font-weight: bold;
`;

const STableHeaderItemIcon = styled.div`
  font-weight: bold;
  width: 24px;
`;

const STableBody = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1em;
  width: 100%;
  background-color: #f0ffff;
  padding-inline: 8px;
`;

const STableBodyItem = styled.div`
  display: flex;
  flex-direction: row;
  gap: 0.5em;
  width: 100%;
  border-bottom: 1px solid #cccc;
  padding-block: 8px;
`;

const STitleDisplay = styled.div`
  width: 10em;
`;

const SButtonWrapper = styled.div`
  display: flex;
  gap: 1em;
`;

const SButton = styled.button`
  width: 80px;
  height: 30px;
  border-radius: 24px;
  background-color: #ffd700;
  color: #fff;
  border: none;
`;

export default App;
