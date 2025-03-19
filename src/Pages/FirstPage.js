import NavBar from "../HeadOfPage/NavBar";
import NavBarV2 from "../HeadOfPage/NavBarV2";
import ColumnGroupingTable from "../Table/DataTable";
import TextFieldBar from "../CherchBar/TextField";

export default function FirstPage() {
    return <>
    <NavBarV2 />
    <TextFieldBar />
    <ColumnGroupingTable />
    </>
}