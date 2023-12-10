import { useDispatch, useSelector } from "react-redux";
import { fetchVehicleLists } from "@/store/slices/vehicleSlice";

function storeapicall() {
    const dispatch = useDispatch();
    const { storeVehicleLists, isStoreLoading } = useSelector((state) => state.reducer.vehicle);

    // console.log("State", state);

    if (isStoreLoading) {
        return <h1>Loading....</h1>;
    }

    return (
        <div>
            <button onClick={(e) => dispatch(fetchVehicleLists())}>Fetch Todos</button>
            {storeVehicleLists && storeVehicleLists.map((e) => <li key={e.id}>{e.title}</li>)}
        </div>
    );
}

export default storeapicall;