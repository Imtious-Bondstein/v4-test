import LoadingScreen from "@/components/LoadingScreen";
import ProtectedRoute from "@/components/authentication/ProtectedRoute";
import { useRouter } from "next/dist/client/router";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
// import { decrement, increment, incrementByAmount } from '../store/slices/counterSlice'

const home = () => {
  // const count = useSelector((state) => state.reducer.counter.value)
  // const auth = useSelector((state) => state.reducer.auth.value)
  const dispatch = useDispatch()
  const router = useRouter()

  useEffect(() => {
    // router.push('/current-location')
  }, [])

  return (
    <div>
      <LoadingScreen />
      {/* <h1 className="text-sky-400">Hello World</h1> */}
      {/* <div>
        <h1 className="text-lg">{count}</h1>
        <div className="flex items-center space-x-2">
          <button onClick={() => dispatch(increment())} className="p-4 text-white bg-blue-500">Increament</button>
          <button onClick={() => dispatch(decrement())} className="p-4 text-white bg-red-500">Decreament</button>
          <button onClick={() => dispatch(incrementByAmount(2))} className="p-4 text-white bg-green-500">Increament By 2</button>
        </div>
      </div> */}
    </div>
  );
};

export default home;

home.getLayout = function getLayout(page) {
  return (
    <ProtectedRoute>
      {page}
    </ProtectedRoute>
  );
};
